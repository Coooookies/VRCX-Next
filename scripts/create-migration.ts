import { execSync } from 'child_process'

const name = process.argv[2]

if (!name) {
  console.error('❌ Please provide a migration name, e.g.: npm run migrate:create TableName')
  process.exit(1)
}

execSync(`npx typeorm migration:create ./src/main/modules/database/migrations/${name}`, {
  stdio: 'inherit'
})
