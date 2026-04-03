# 🐛 Bug Report — Task Manager API

## Bug 1: Pagination Issue

- **Expected Behavior:**
  Page 1 with limit 2 should return the first 2 tasks.

- **Actual Behavior:**
  It skips initial tasks and returns incorrect results.

- **How I Discovered It:**
  Wrote a test for `/tasks?page=1&limit=2` and saw wrong output.

- **Fix:**
  Changed offset from `page * limit` to `(page - 1) * limit`.

---

## Bug 2: Status Filtering Issue

- **Expected Behavior:**
  `/tasks?status=todo` should return only tasks with status "todo".

- **Actual Behavior:**
  Filtering was inaccurate due to partial matching.

- **How I Discovered It:**
  Tested with multiple task statuses and observed incorrect filtering.

- **Fix:**
  Replaced `.includes()` with strict equality (`===`).

---

## Bug 3: Update Validation Issue

- **Expected Behavior:**
  Only valid fields should be updated (title, status, etc.).

- **Actual Behavior:**
  Any field could be updated, including invalid or unwanted fields.

- **How I Discovered It:**
  Sent invalid fields in update request and they were accepted.

- **Fix:**
  Restricted updates to allowed fields only.