type OembedType = "photo" | "video" | "link" | "rich";

export interface OembedBase {
  type: OembedType;
  version: string;
  title?: string;
  "author_name"?: string;
  "author_url"?: string;
  "provider_name"?: string;
  "provider_url"?: string;
  "cache_age"?: string;
  "thumbnail_url"?: string;
  "thumbnail_width"?: number;
  "thumbnail_height"?: number;
}

export interface PhotoOembed extends OembedBase {
  type: "photo";
  width: number;
  height: number;
}

export interface VideoOembed extends OembedBase {
  type: "video";
  html: string;
  width: number;
  height: number;
}

export interface LinkOembed extends OembedBase {
  type: "link";
}

export interface RichOembed extends OembedBase {
  type: "rich";
  html: string;
  width: number;
  height: number;
}

export async function request<T extends OembedBase>(
  endpoint: string,
  argument: {
    url: string;
    maxwidth?: number;
    maxheight?: number;
    format?: string;
  },
): Promise<T> {
  const url = new URL(endpoint);
  Object.entries(argument).map(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );

  const response = await fetch(url);
  return await response.json();
}
