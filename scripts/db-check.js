require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = 'xcfqbwtlimgrkgpypzmj';

// Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`Checking connection to: ${projectRef}`);

async function checkConnection() {
    if (!accessToken) {
        console.log("No SUPABASE_ACCESS_TOKEN found. Cannot query Management API.");
        return;
    }

    // METHOD: Fetch TypeScript Types (lists all tables implicitly)
    console.log("\n--- Fetching Database Schema (via Types API) ---");
    try {
        const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/types/typescript`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (response.ok) {
            const typesText = await response.text();
            console.log("✅ Schema fetched successfully.");

            // Debug: print start of file
            // console.log(typesText.substring(0, 500)); 

            // Extract table names from standard Supabase type definition
            // Look for "Tables: {"
            const tablesRegex = /Tables:\s*{([\s\S]*?)}/m;
            const match = typesText.match(tablesRegex);

            if (match && match[1]) {
                const tableBlock = match[1];
                // Parse keys from the block. Lines look like: "      comment: { ... }"
                const lines = tableBlock.split('\n');
                const tables = lines
                    .map(line => line.trim())
                    .filter(line => line.includes(': {'))
                    .map(line => line.split(':')[0])
                    .filter(t => !t.startsWith('//')); // filter comments

                console.log("\nFound Tables:");
                console.log(tables.join(', '));
                // return; // Removed to allow query execution
            } else {
                console.log("Could not parse table names from types definition, but connection is OK.");
            }
        } else {
            console.log(`Types API failed: ${response.status} ${response.statusText}`);
        }
    } catch (e) {
        console.error("Error fetching types:", e.message);
    }

    // Fallback: PostgREST Root
    console.log("\n--- Checking PostgREST Root ---");
    try {
        const restResponse = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
        if (restResponse.ok) {
            console.log("✅ PostgREST Root is accessible.");
            const json = await restResponse.json();
            // Often the root returns an empty object or swagger if configured.
            // Let's try to list definitions if available in the swagger endpoint
            const openApi = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`, {
                headers: { 'Accept': 'application/openapi+json' }
            });

            if (openApi.ok) {
                const spec = await openApi.json();
                const tables = Object.keys(spec.definitions || {}).filter(k => !k.includes('.'));
                console.log("\nExposed Tables:");
                console.log(tables.join(', '));
            }
        } else {
            console.log(`PostgREST failed: ${restResponse.status}`);
        }
    } catch (e) {
        console.error("Error checking PostgREST:", e.message);
    }
    // METHOD 4: Test Data Access (Simulated SQL)
    console.log("\n--- Executing Test Query (SELECT * FROM agents LIMIT 1) ---");
    const { data, error } = await supabase
        .from('agents')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Query failed:", error.message);
    } else {
        console.log("Query successful. Result:");
        console.table(data);
    }
}

checkConnection();
