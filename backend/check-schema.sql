.schema expenses
.schema expense_categories
SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%expense%';
