import styles from './BlogPanel.module.css';
export default function BlogPanel({ date, title, tags }){
  const dateObject = typeof date === 'string' ? new Date(date):date;
  return (
    <div className={styles.panel}>
      <p className={styles.date}>
        {dateObject.toLocaleDateString('ja-JP')}
      </p>
      <h3 className={styles.title}>{title}</h3>
      {tags && tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {tags.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
