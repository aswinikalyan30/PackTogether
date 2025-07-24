# 🚨 NETLIFY QUICK FIX - URGENT

## Problem: Netlify using wrong UI settings instead of netlify.toml

**Error**: `npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/opt/build/repo/package.json'`

**Root Cause**: Netlify UI settings are overriding our netlify.toml configuration.

## ⚡ IMMEDIATE FIX

**Go to your Netlify site dashboard → Site Settings → Build & Deploy → Build Settings**

Change these settings:

### 1. **Build Command**
```
cd trip-planner && npm ci --prefer-offline --no-audit && rm -rf build && rm -rf node_modules/.cache && CI=false NODE_ENV=production npm run build
```

### 2. **Publish Directory** 
```
trip-planner/build
```

### 3. **Base Directory (Advanced)**
```
(leave empty or set to: .)
```

## 🔧 Environment Variables (optional but recommended)

**Site Settings → Environment Variables → Add:**

- `NODE_VERSION` = `18`
- `CI` = `false`  
- `NODE_ENV` = `production`
- `GENERATE_SOURCEMAP` = `false`

## ✅ After Making Changes

1. **Clear Cache**: Site Settings → Build & Deploy → Clear Build Cache
2. **Trigger Rebuild**: Deploys → Trigger Deploy → Clear Cache and Deploy Site

## 📁 Expected Result

The build should:
- Install dependencies in trip-planner directory ✅
- Build successfully with warnings (not errors) ✅
- Deploy to trip-planner/build directory ✅
- Serve your React app correctly ✅

---

**Why this works**: The error happened because Netlify was looking for package.json in the repository root instead of the trip-planner subdirectory. The UI settings override the netlify.toml file in some cases.

**Alternative**: You can also move package.json to the repository root, but the above approach is cleaner and maintains the existing project structure.