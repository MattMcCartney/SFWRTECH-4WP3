// app/layout.js
// Layout for web app

export const metadata = {
  title: 'D&D Character Manager',
  description: 'Manage your Dungeons & Dragons Characters',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        fontFamily: 'sans-serif',
        margin: 0,
        padding: '1rem',
        backgroundColor: '#f9f9f9'
      }}>
        <header style={{
          marginBottom: '2rem',
          borderBottom: '1px solid #ccc',
          paddingBottom: '1rem'
        }}>
          <h1>D&D Character Manager</h1>
          <nav>
            <a href="/collection" style={{ marginRight: '1rem' }}>Collection</a>
            <a href="/admin">Admin</a>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}