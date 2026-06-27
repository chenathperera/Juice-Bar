import { environment } from '../../environments/environment';

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path?.trim()) {
    return '';
  }

  const trimmedPath = path.trim();

  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }

  if (trimmedPath.startsWith('/')) {
    if (environment.apiUrl.startsWith('http://') || environment.apiUrl.startsWith('https://')) {
      const backendBaseUrl = environment.apiUrl.replace(/\/api$/, '');
      return `${backendBaseUrl}${trimmedPath}`;
    }

    return trimmedPath;
  }

  return trimmedPath;
}
