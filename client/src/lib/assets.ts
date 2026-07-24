export function assetUrl(path: string) {
  if (!path || /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function hideBrokenImage(event: { currentTarget: HTMLImageElement }) {
  event.currentTarget.style.display = 'none';
}
