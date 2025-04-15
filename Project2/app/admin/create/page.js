// app/admin/create/page.js
// Used to create a new item

import CreateForm from './CreateForm';

export default function CreatePage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create New Character</h2>
      <CreateForm />
    </div>
  );
}