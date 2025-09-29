#!/usr/bin/env node

const { argv, env, exit, stdout } = process;

const FLAG_NAMES = new Set([
  '--token',
  '--owner',
  '--repo',
  '--list',
  '--list-categories',
  '--limit',
  '--get',
  '--create',
  '--comment',
  '--list-comments',
  '--title',
  '--body',
  '--category-id',
  '--reply-to',
  '--answered',
  '--state',
  '--format',
  '--help',
]);

function printHelp() {
  stdout.write(`GitHub Discussions Utility (Node 24+ required)\n\n`);
  stdout.write(`Usage: node scripts/discussions.js [options]\n\n`);
  stdout.write(`Authentication:\n`);
  stdout.write(`  --token <token>         GitHub personal access token (falls back to GITHUB_TOKEN env).\n\n`);
  stdout.write(`Repository selection (required for all actions except --help):\n`);
  stdout.write(`  --owner <owner>         Repository owner (user or org).\n`);
  stdout.write(`  --repo <repo>           Repository name.\n\n`);
  stdout.write(`Actions (specify exactly one):\n`);
  stdout.write(`  --list [--limit <n>]    List recent discussions using the GraphQL API.\n`);
  stdout.write(`  --list-categories       List discussion categories with GraphQL IDs.\n`);
  stdout.write(`  --get <number>          Fetch a discussion via the REST API.\n`);
  stdout.write(`  --create                Create a discussion using the GraphQL API. Requires --title, --body, --category-id.\n`);
  stdout.write(`  --list-comments <num>   List comments for a discussion using the GraphQL API.\n`);
  stdout.write(`  --comment <number>      Add a comment or reply via the GraphQL API. Requires --body.\n\n`);
  stdout.write(`Additional options:\n`);
  stdout.write(`  --title <text>          Title for --create.\n`);
  stdout.write(`  --body <text>           Markdown body for --create or --comment.\n`);
  stdout.write(`  --category-id <id>      Discussion category node ID for --create or to filter --list.\n`);
  stdout.write(`  --answered <state>      Filter --list results: answered, unanswered, true, false, or any (default).\n`);
  stdout.write(`  --state <state>         Filter --list results by state (open or closed). May be repeated.\n`);
  stdout.write(`  --reply-to <id>         Reply to an existing comment (use with --comment).\n`);
  stdout.write(`  --format <type>         Output format: json (default) or text.\n`);
  stdout.write(`  --help                  Show this message.\n\n`);
  stdout.write(`Examples:\n`);
  stdout.write(`  GITHUB_TOKEN=ghp_x node scripts/discussions.js --owner octocat --repo hello-world --list --limit 5\n`);
  stdout.write(`  node scripts/discussions.js --token ghp_x --owner octocat --repo hello-world --list-categories\n`);
  stdout.write(`  node scripts/discussions.js --token ghp_x --owner octocat --repo hello-world --create --title "Hello" --body "Hi" --category-id MDg6Q2F0ZWdvcnkxMjM=\n`);
  stdout.write(`  node scripts/discussions.js --token ghp_x --owner octocat --repo hello-world --comment 42 --body "Great update!"\n`);
  stdout.write(`  node scripts/discussions.js --token ghp_x --owner octocat --repo hello-world --comment 42 --reply-to MDEyOkRpc2N1c3Npb25Db21tZW50MTIz --body "Thanks for clarifying"\n`);
}

const args = argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  printHelp();
  exit(0);
}

function takeValue(list, index, flag) {
  const value = list[index + 1];
  if (value === undefined || FLAG_NAMES.has(value)) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parseInteger(value, flag) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`${flag} requires an integer value`);
  }
  return parsed;
}

function parseArgs(list) {
  const opts = { format: 'json' };
  for (let i = 0; i < list.length; i += 1) {
    const arg = list[i];
    switch (arg) {
      case '--token':
        opts.token = takeValue(list, i, '--token');
        i += 1;
        break;
      case '--owner':
        opts.owner = takeValue(list, i, '--owner');
        i += 1;
        break;
      case '--repo':
        opts.repo = takeValue(list, i, '--repo');
        i += 1;
        break;
      case '--list':
        opts.action = ensureSingleAction(opts.action, 'list');
        break;
      case '--list-categories':
        opts.action = ensureSingleAction(opts.action, 'listCategories');
        break;
      case '--limit':
        opts.limit = parseInteger(takeValue(list, i, '--limit'), '--limit');
        if (!Number.isFinite(opts.limit) || opts.limit <= 0) {
          throw new Error('--limit requires a positive integer');
        }
        i += 1;
        break;
      case '--get':
        opts.action = ensureSingleAction(opts.action, 'get');
        opts.number = parseInteger(takeValue(list, i, '--get'), '--get');
        i += 1;
        break;
      case '--create':
        opts.action = ensureSingleAction(opts.action, 'create');
        break;
      case '--comment':
        opts.action = ensureSingleAction(opts.action, 'comment');
        opts.number = parseInteger(takeValue(list, i, '--comment'), '--comment');
        i += 1;
        break;
      case '--list-comments':
        opts.action = ensureSingleAction(opts.action, 'listComments');
        opts.number = parseInteger(takeValue(list, i, '--list-comments'), '--list-comments');
        i += 1;
        break;
      case '--title':
        opts.title = takeValue(list, i, '--title');
        i += 1;
        break;
      case '--body':
        opts.body = takeValue(list, i, '--body');
        i += 1;
        break;
      case '--category-id':
        opts.categoryId = takeValue(list, i, '--category-id');
        i += 1;
        break;
      case '--reply-to':
        opts.replyToId = takeValue(list, i, '--reply-to');
        i += 1;
        break;
      case '--answered': {
        const value = takeValue(list, i, '--answered').toLowerCase();
        if (!['answered', 'unanswered', 'true', 'false', 'any'].includes(value)) {
          throw new Error('--answered must be one of answered, unanswered, true, false, or any');
        }
        if (value === 'any') {
          opts.answered = undefined;
        } else {
          opts.answered = value === 'answered' || value === 'true';
        }
        i += 1;
        break;
      }
      case '--state': {
        const value = takeValue(list, i, '--state').toUpperCase();
        if (!['OPEN', 'CLOSED'].includes(value)) {
          throw new Error('--state must be open or closed');
        }
        opts.states = opts.states ?? [];
        if (!opts.states.includes(value)) {
          opts.states.push(value);
        }
        i += 1;
        break;
      }
      case '--format': {
        const value = takeValue(list, i, '--format').toLowerCase();
        if (!['json', 'text'].includes(value)) {
          throw new Error(`Unsupported --format value: ${value}`);
        }
        opts.format = value;
        i += 1;
        break;
      }
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return opts;
}

function ensureSingleAction(existing, next) {
  if (existing && existing !== next) {
    throw new Error(`Multiple actions specified (${existing} and ${next}). Please choose one.`);
  }
  return next;
}

async function main() {
  let options;
  try {
    options = parseArgs(args);
  } catch (error) {
    console.error(error.message);
    printHelp();
    exit(1);
  }

  const token = options.token || env.GITHUB_TOKEN;
  if (!token) {
    console.error('Missing GitHub token. Provide via --token or GITHUB_TOKEN env var.');
    exit(1);
  }

  if (!options.owner || !options.repo) {
    console.error('Missing --owner or --repo argument.');
    exit(1);
  }

  if (!options.action) {
    console.error('No action specified. Use --list, --list-categories, --get, --create, --list-comments, or --comment.');
    exit(1);
  }

  try {
    switch (options.action) {
      case 'list':
        await handleList(options, token);
        break;
      case 'listCategories':
        await handleListCategories(options, token);
        break;
      case 'get':
        await handleGet(options, token);
        break;
      case 'create':
        await handleCreate(options, token);
        break;
      case 'comment':
        await handleComment(options, token);
        break;
      case 'listComments':
        await handleListComments(options, token);
        break;
      default:
        throw new Error(`Unhandled action: ${options.action}`);
    }
  } catch (error) {
    console.error(error.message);
    if (error.responseBody) {
      console.error(JSON.stringify(error.responseBody, null, 2));
    }
    exit(1);
  }
}

async function requestGraphQL(token, query, variables = {}) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'dev-context-discussions-script',
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();
  if (!response.ok || payload.errors) {
    const error = new Error('GitHub GraphQL API request failed');
    error.responseBody = payload;
    throw error;
  }
  return payload.data;
}

async function requestREST(token, method, path, body) {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'dev-context-discussions-script',
  };
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  const rawBody = await response.text();
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      payload = rawBody;
    }
  }

  if (!response.ok) {
    const error = new Error(`GitHub REST API request failed with status ${response.status}`);
    error.responseBody = payload;
    throw error;
  }
  return payload;
}

async function handleList(options, token) {
  const limit = Number.isFinite(options.limit) && options.limit > 0 ? options.limit : 20;
  const query = `
    query($owner: String!, $name: String!, $first: Int!, $categoryId: ID, $answered: Boolean, $states: [DiscussionState!]) {
      repository(owner: $owner, name: $name) {
        discussions(
          first: $first,
          orderBy: {field: CREATED_AT, direction: DESC},
          categoryId: $categoryId,
          answered: $answered,
          states: $states
        ) {
          nodes {
            id
            number
            title
            createdAt
            url
            answerChosenAt
            isAnswered
            closed
            category { id name }
            author { login }
          }
        }
      }
    }
  `;

  const variables = {
    owner: options.owner,
    name: options.repo,
    first: limit,
  };
  if (options.categoryId) {
    variables.categoryId = options.categoryId;
  }
  if (typeof options.answered === 'boolean') {
    variables.answered = options.answered;
  }
  if (options.states && options.states.length > 0) {
    variables.states = options.states;
  }

  const data = await requestGraphQL(token, query, variables);

  const nodes = (data?.repository?.discussions?.nodes ?? []).map((node) => ({
    ...node,
    state: node.closed ? 'CLOSED' : 'OPEN',
  }));
  output(nodes, options.format);
}

async function handleListCategories(options, token) {
  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        discussionCategories(first: 100) {
          nodes {
            id
            name
            description
            isAnswerable
          }
        }
      }
    }
  `;
  const data = await requestGraphQL(token, query, {
    owner: options.owner,
    name: options.repo,
  });

  const categories = data?.repository?.discussionCategories?.nodes ?? [];
  const formatted = categories.map((category) => ({
    id: category.id,
    name: category.name,
    answerable: category.isAnswerable,
    description: category.description,
  }));

  output({ repositoryId: data?.repository?.id, categories: formatted }, options.format);
}

async function handleGet(options, token) {
  if (!Number.isFinite(options.number)) {
    throw new Error('--get requires a discussion number');
  }
  const result = await requestREST(
    token,
    'GET',
    `/repos/${options.owner}/${options.repo}/discussions/${options.number}`,
  );
  output(result, options.format);
}

async function handleCreate(options, token) {
  if (!options.title) {
    throw new Error('--create requires --title');
  }
  if (!options.body) {
    throw new Error('--create requires --body');
  }
  if (!options.categoryId) {
    throw new Error('--create requires --category-id');
  }

  const repositoryId = await getRepositoryId(options, token);
  const mutation = `
    mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
      createDiscussion(input: {
        repositoryId: $repositoryId,
        categoryId: $categoryId,
        title: $title,
        body: $body
      }) {
        discussion {
          id
          number
          title
          url
        }
      }
    }
  `;

  const data = await requestGraphQL(token, mutation, {
    repositoryId,
    categoryId: options.categoryId,
    title: options.title,
    body: options.body,
  });

  output(data?.createDiscussion?.discussion, options.format);
}

async function handleComment(options, token) {
  if (!Number.isFinite(options.number)) {
    throw new Error('--comment requires a discussion number');
  }
  if (!options.body) {
    throw new Error('--comment requires --body');
  }

  const discussionId = await getDiscussionId(options, token);
  const mutation = `
    mutation($discussionId: ID!, $replyToId: ID, $body: String!) {
      addDiscussionComment(
        input: {
          discussionId: $discussionId,
          replyToId: $replyToId,
          body: $body
        }
      ) {
        comment {
          id
          url
          createdAt
          author { login }
          replyTo { id }
          body
        }
      }
    }
  `;

  const data = await requestGraphQL(token, mutation, {
    discussionId,
    replyToId: options.replyToId ?? null,
    body: options.body,
  });

  output(data?.addDiscussionComment?.comment, options.format);
}

async function getRepositoryId(options, token) {
  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) { id }
    }
  `;
  const data = await requestGraphQL(token, query, {
    owner: options.owner,
    name: options.repo,
  });
  const repositoryId = data?.repository?.id;
  if (!repositoryId) {
    throw new Error('Unable to resolve repository ID for createDiscussion.');
  }
  return repositoryId;
}

async function getDiscussionId(options, token) {
  const query = `
    query($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        discussion(number: $number) {
          id
        }
      }
    }
  `;
  const data = await requestGraphQL(token, query, {
    owner: options.owner,
    name: options.repo,
    number: options.number,
  });
  const discussionId = data?.repository?.discussion?.id;
  if (!discussionId) {
    throw new Error('Unable to resolve discussion ID. Check the discussion number.');
  }
  return discussionId;
}

async function handleListComments(options, token) {
  if (!Number.isFinite(options.number)) {
    throw new Error('--list-comments requires a discussion number');
  }

  const query = `
    query($owner: String!, $name: String!, $number: Int!, $after: String) {
      repository(owner: $owner, name: $name) {
        discussion(number: $number) {
          id
          number
          title
          url
          comments(first: 100, after: $after) {
            nodes {
              id
              url
              createdAt
              updatedAt
              isAnswer
              replyTo { id }
              author { login }
              body
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    }
  `;

  const comments = [];
  let after = null;
  let hasNextPage = true;
  let discussionSummary = null;

  while (hasNextPage) {
    const data = await requestGraphQL(token, query, {
      owner: options.owner,
      name: options.repo,
      number: options.number,
      after,
    });

    const discussion = data?.repository?.discussion;
    if (!discussion) {
      throw new Error('Discussion not found.');
    }

    if (!discussionSummary) {
      discussionSummary = {
        id: discussion.id,
        number: discussion.number,
        title: discussion.title,
        url: discussion.url,
      };
    }

    const batch = discussion.comments?.nodes ?? [];
    comments.push(...batch);

    if (Number.isFinite(options.limit) && options.limit > 0 && comments.length >= options.limit) {
      comments.length = options.limit;
      break;
    }

    hasNextPage = Boolean(discussion.comments?.pageInfo?.hasNextPage);
    after = discussion.comments?.pageInfo?.endCursor ?? null;
    if (!hasNextPage) {
      break;
    }
  }

  if (!discussionSummary) {
    throw new Error('Discussion not found.');
  }

  output(
    {
      discussion: discussionSummary,
      comments,
    },
    options.format,
  );
}

function output(value, format) {
  if (format === 'text') {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        stdout.write(`${renderText(item)}\n\n`);
      });
    } else {
      stdout.write(`${renderText(value)}\n`);
    }
    return;
  }
  stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function renderText(value) {
  if (value == null) {
    return 'null';
  }
  if (typeof value !== 'object') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => `- ${renderText(item)}`).join('\n');
  }
  const entries = Object.entries(value)
    .filter(([, v]) => v !== undefined)
    .map(([key, v]) => `${key}: ${renderText(v)}`);
  return entries.join('\n');
}

main();
