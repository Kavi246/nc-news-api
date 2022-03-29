# Naming Conventions
- There should be a SEPARATE FOLDER for controllers and models, and your files should be called `<table>.controller.js`, eg `articles.controller.js`, `comments.model.js` etc.
```
project
| app.js etc.
|
|__controllers
|     articles.controller.js
|     comments.controller.js
|     // etc
|__models
      articles.model.js
      comments.model.js
      // etc
```
## Controller
- In your controller, the functions need to be named after the HTTP requests you're doing, followed by the table you're accessing, followed by anything extra:
  `getArticles`, `postArticle`, `patchArticleById`, `deleteArticleById` etc.
## Model
- The model needs to put these across but with a synonym for the request, so `get` becomes `fetch`, `patch` becomes `update`, `post` becomes `send` (or similar), `delete` becomes `remove` etc, so:
  `fetchArticles`, `sendArticle`, `updateArticleById`, `removeArticleById`
## Other
- It is good practice to ALWAYS name your variables in an appropriate way, i.e. `snake_case` for queries/database related variables and `camelCase` for functions and other variables inside functions.
- Think about WHAT you're returning from your controller, because it will need to be contained in an object with a key of that name, e.g.:
```js
// Controller
exports.getReviewById = async (req, res, next) => {
  try {
    const { review_id } = params;
    const review = await fetchReviewById(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};
// Model
export const fetchReviewById = async (review_id) => {
  let queryStr = `
  PUT YOUR QUERY HERE I'M NOT GIVING IT TO YOU
  `;
  const values = [review_id];
  const response = await db.query(queryStr, values);
  const review = response.rows[0];
  if (!review) {
    return Promise.reject({ status: 404, msg: "Review Not Found!" });
  } else return review;
};
```
- Naming things properly NOW will help you not only in back end, but also when you arrive at front end.
### PS
- A good idea for tests is to nest some describe blocks...
```js
describe("REVIEWS", () => {
  describe("GET REVIEW BY ID", () => {
    test("200 - GET Review by ID", async () => {
    test("400 - Bad request - GET Review by ID", async () => {
    test("404 - Review Does Not Exist - GET Review by ID", async () => {
  describe("PATCH REVIEW BY ID", () => {
    test("201 - Increases votes review by ID", async () => {
    test("400 - Bad request - string review_id", async () => {
describe("COMMENTS", () => {
    // etc
```