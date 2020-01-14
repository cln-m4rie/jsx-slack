module.exports = async () => {
  // Set up fixed UTC timezone for running tests
  process.env.TZ = 'UTC'
}
