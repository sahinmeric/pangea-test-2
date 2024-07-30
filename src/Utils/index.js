//index.js in /Utils
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (password) => {
  return password.length >= 6 ? true : false;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isCompanyBalanceValid = (input) => {
  if (!parseFloat(input)) return false;

  var pattern = /^\d{1,8}(\.\d{1,2})?$/;
  return pattern.test(input);
};

export const isValidCompanySeats = (input) => {
  var pattern = /^\d(,\d)*$/;
  return pattern.test(input);
};

export const isJSONObject = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  try {
    JSON.stringify(obj);
    return true;
  } catch (e) {
    return false;
  }
};

export const isJSONString = (str) => {
  if (typeof str !== "string") {
    return false;
  }
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

//Takes a list of object {name: string, value: int}
function CalculateRange(list){
  let lowest = list[0];
  let highest = list[0]
  list.forEach(promo => {
    if(promo.value < lowest.value)
      lowest = promo;
    else if (promo.value > highest.value)
      highest = promo;
  });
  return({lowest: lowest, highest: highest})
}

export const getInfoFromCreator = (creator) => {
  if (creator === undefined)
    return { creatorInfo: [], followersData: [], promotionData: [] };

  const creatorInfo = [
    {
      name: 'TikTok Profile',
      link: creator.tiktok_link || '',
      value: creator.tiktok_link ? 'View TikTok' : 'none',
    },
    {
      name: 'Instagram Profile',
      link: creator.instagram_link || '',
      value: creator.instagram_link ? 'View Instagram' : 'none',
    },
    {
      name: 'YouTube Channel',
      link: creator.youtube_link || '',
      value: creator.youtube_link ? 'View YouTube' : 'none',
    },
    {
      name: 'Presented By',
      link: '',
      value: creator.manager || '',
    },
    {
      name: 'TikTok Followers',
      link: '',
      value: creator.tiktok || 0,
    },
    {
      name: 'Instagram Followers',
      link: '',
      value: creator.instagram || 0,
    },
    {
      name: 'YouTube Subscribers',
      link: '',
      value: creator.youtube || 0,
    },
  ];

  const followersData = [
    { name: 'TikTok', value: Number(creator.tiktok?.replaceAll(',', '')) || 0 },
    { name: 'Instagram', value: Number(creator.instagram?.replaceAll(',', '')) || 0 },
    { name: 'YouTube', value: Number(creator.youtube?.replaceAll(',', '')) || 0 },
  ];

  const onlyNum = /[^0-9.-]+/g;

  const tikTokPromotionData = [
    {
      name: 'TikTok Sound',
      value: Number((creator.tiktok_sound || '0').replace(onlyNum, '')),
    },
    {
      name: 'TikTok Brand',
      value: Number((creator.tiktok_brand || '0').replace(onlyNum, '')),
    },
  ];

  const instaPromotionData = [
    {
      name: 'Instagram Sound',
      value: Number((creator.ig_reels_sound || '0').replace(onlyNum, '')),
    },
    {
      name: 'Instagram Post',
      value: Number((creator.ig_feed_post || '0').replace(onlyNum, '')),
    },
    {
      name: 'Instagram Brand',
      value: Number((creator.ig_reels_brand || '0').replace(onlyNum, '')),
    },
    {
      name: 'Instagram Story',
      value: Number((creator.ig_story || '0').replace(onlyNum, '')),
    },
  ];

  const youtubePromotionData = [
    {
      name: 'YouTube Shorts',
      value: Number((creator.youtube_shorts || '0').replace(onlyNum, '')),
    },
    {
      name: 'YouTube 30-45s',
      value: Number((creator.youtube_30_45s || '0').replace(onlyNum, '')),
    },
  ];

  const promotionData = [
    {
      name: 'TikTok',
      ...CalculateRange(tikTokPromotionData),
    },
    {
      name: 'Instagram',
      ...CalculateRange(instaPromotionData),
    },
    {
      name: 'YouTube',
      ...CalculateRange(youtubePromotionData),
    },
  ];

  return { creatorInfo, followersData, promotionData };
};


export function findMaxValue(arr) {
  let maxValue = 0;

  for (let i = 0; i < arr.length; i++) {
    maxValue = Math.max(arr[i].lowest.value, maxValue);
    maxValue = Math.max(arr[i].highest.value, maxValue);
  }

  return maxValue;
}