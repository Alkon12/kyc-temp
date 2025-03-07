const execSync = require('child_process').execSync

const randomId = `${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}`
const tagName = `prod-deploy-${randomId}`

execSync(`yarn graphql`, { stdio: [0, 1, 2] })
execSync(`yarn prisma generate`, { stdio: [0, 1, 2] })
// execSync(`yarn test`)
execSync(`yarn build`, { stdio: [0, 1, 2] })

execSync(`git push --force-with-lease && git tag ${tagName} && git push --tags origin`, { stdio: [0, 1, 2] })
execSync('echo "${GREEN} Pipelines https://bitbucket.org/grupo-autofin/web/pipelines/results/page/1"', {
  stdio: [0, 1, 2],
})
