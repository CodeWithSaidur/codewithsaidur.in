async function main() {
  console.log('Database is now file-based and stored in the /Data folder.')
  console.log('JSON files are automatically initialized when the application starts or when data is first saved.')
  console.log('No manual seeding is required for the admin account as it uses .env credentials.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
