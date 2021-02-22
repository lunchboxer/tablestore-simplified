module.exports.validateKey = key => {
  // tablestore sets the following restrictions on column names
  // 1. alphanumeric plus _
  // 2. can't start with a number
  // 3. 1-255 characters long
  // 4. unique
  // No checking for uniqueness here
  const validRegex = /^[A-Z_a-z]\w{0,244}/
  if (!validRegex.test(key)) {
    throw new Error(
      `Key '${key}' is not a valid TableStore column name. It must be 1-255 ascii letters or numbers or underscore, but cannot begin with a number.`,
    )
  }
  return true
}
