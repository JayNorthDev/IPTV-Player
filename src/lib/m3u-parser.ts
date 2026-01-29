
type Tvg = {
  id: string;
  name: string;
  logo: string;
};

type Group = {
  title: string;
};

type Http = {
  "content-type"?: string;
};

export type Channel = {
  tvg: Tvg;
  group: Group;
  http: Http;
  name: string;
  url: string;
};

// Manual M3U parser to replace iptv-playlist-parser
export const manualParse = (m3u: string): { items: Channel[] } => {
  const lines = m3u.split('\n');
  const items: Channel[] = [];
  let currentItem: Partial<Channel> = { tvg: {} as Tvg, group: {} as Group, http: {} as Http };

  for (const line of lines) {
    if (line.startsWith('#EXTINF:')) {
      const info = line.substring(8).trim();
      const tvgIdMatch = info.match(/tvg-id="([^"]*)"/);
      const tvgNameMatch = info.match(/tvg-name="([^"]*)"/);
      const tvgLogoMatch = info.match(/tvg-logo="([^"]*)"/);
      const groupTitleMatch = info.match(/group-title="([^"]*)"/);
      const nameMatch = info.match(/,(.*)$/);

      currentItem.tvg = {
        id: tvgIdMatch ? tvgIdMatch[1] : '',
        name: tvgNameMatch ? tvgNameMatch[1] : '',
        logo: tvgLogoMatch ? tvgLogoMatch[1] : '',
      };
      currentItem.group = {
        title: groupTitleMatch ? groupTitleMatch[1] : '',
      };
      currentItem.name = nameMatch ? nameMatch[1].trim() : '';

    } else if (line.startsWith('http')) {
      currentItem.url = line.trim();
      items.push(currentItem as Channel);
      currentItem = { tvg: {} as Tvg, group: {} as Group, http: {} as Http };
    }
  }
  return { items };
};
