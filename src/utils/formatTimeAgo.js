function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diff = now - date;
  const diffMinutes = Math.round(diff / (1000 * 60));
  const diffHours = Math.round(diff / (1000 * 60 * 60));
  const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
      return 'just now';
  } else if (diffMinutes === 1) {
      return '1 minute ago';
  } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
  } else if (diffHours === 1) {
      return '1 hour ago';
  } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
      return '1 day ago';
  } else if (diffDays < 7) {
      return `${diffDays} days ago`;
  } else {
      const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"
      };
      return date.toLocaleDateString("en-US", options);
  }
}


  module.exports = {
    formatTimeAgo
  };
  