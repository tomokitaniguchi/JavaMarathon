const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3449;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: 'user_tomoki_taniguchi', // PostgreSQLのユーザー名に置き換えてください
  host: 'localhost',
  database: 'db_tomoki_taniguchi', // PostgreSQLのデータベース名に置き換えてください
  password: 'pass', // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 一覧表示画面の処理
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 新規顧客情報を登録する処理
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name,industry,contact,location) VALUES ($1,$2,$3,$4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));

// 詳細表示画面の処理
app.get("/customer/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId; // URL パラメータから customerId を取得
    const customerData = await pool.query(
      "SELECT customer_id, company_name, industry, contact, location, created_date, updated_date FROM customers WHERE customer_id = $1",
     [customerId]); // クエリの WHERE 句に customerId を使用
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 顧客情報を削除する処理
app.delete("/delete/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId; // URL パラメータから customerId を取得
    const deleteCustomer = await pool.query(
      "DELETE FROM customers WHERE customer_id = $1",
      [customerId]);
    res.json({ success: true, customer: deleteCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客情報を変更する処理
app.post("/edit/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { companyName, industry, contact, location } = req.body;
    const deleteCustomer = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4, updated_date = CURRENT_TIMESTAMP WHERE customer_id = $5",
      [companyName, industry, contact, location, customerId]);
    res.json({ success: true, customer: deleteCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 新規案件情報を登録する処理
app.post("/add-case", async (req, res) => {
  try {
    const { caseName, caseStatus, expectedRevenue, representative } = req.body;
    const newCase = await pool.query(
      "INSERT INTO cases (case_name,case_status,expected_revenue,representative) VALUES ($1,$2,$3,$4) RETURNING *",
      [caseName, caseStatus, expectedRevenue, representative]
    );
    res.json({ success: true, customer: newCase.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 案件一覧表示画面の処理
app.get("/cases", async (req, res) => {
  try {
    const caseData = await pool.query("SELECT * FROM cases");
    res.send(caseData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});