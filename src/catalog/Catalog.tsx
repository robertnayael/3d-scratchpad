import experiments from '@/experiments';

export function Catalog() {
  return (
    <nav>
      <ul>
        {experiments.map((e) => (
          <li key={e.id}>
            <a href={e.id}>{e.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
