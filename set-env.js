const fs = require('fs');
const path = require('path');

const envDirectory = './src/environments';
const targetPath = path.join(__dirname, './src/environments/environment.prod.ts');

// Crea la cartella se non esiste
if (!fs.existsSync(envDirectory)) {
  fs.mkdirSync(envDirectory, { recursive: true });
}

// Genera il contenuto usando process.env (variabili di Vercel)
const envConfigFile = `export const environment = {
  production: true,
  supabaseUrl: '${process.env.SUPABASE_URL}',
  supabaseAnonKey: '${process.env.SUPABASE_ANON_KEY}',
  supabaseServiceRoleKey: ''
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`✅ Generato environment.prod.ts per la build di Vercel`);