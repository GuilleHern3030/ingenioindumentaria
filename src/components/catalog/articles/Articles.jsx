import { useState, useRef, useEffect, useCallback } from "react";
import Article from "./article/Article";
import styles from "./Articles.module.css";

const articlesPerLoad = 12; // cantidad por carga

export default function Articles({ articles, onArticleSelect }) {
  const [visibleCount, setVisibleCount] = useState(articlesPerLoad);
  const loaderRef = useRef(null);

  // Cargar más artículos cuando el "loader" entra en pantalla
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + articlesPerLoad, articles.length));
    }
  }, [articles.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: "100px", // empieza a cargar antes de llegar al final
      threshold: 0.1,
    });

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [handleObserver]);

  const visibleArticles = articles.slice(0, visibleCount);

  return (
    <section className={styles.articles}>
      {visibleArticles.map((article, key) => (
        <Article
          key={key}
          className={styles.article}
          article={article}
          onClick={() => onArticleSelect(article.id())}
        />
      ))}

      {/* Loader: el observer se engancha acá */}
      {visibleCount < articles.length && (
        <div ref={loaderRef} className={styles.loader}>
          Cargando más artículos...
        </div>
      )}
    </section>
  );
}