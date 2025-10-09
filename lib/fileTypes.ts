
export function getFileTypesByCategory(category: string | null): string[] | null {
    const map: Record<string, string[]> = {
      document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint",  
      ],
      image: [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/svg+xml",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/vnd.adobe.photoshop",
      ],
      video: [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-flv",
        "video/mp2t",
        "video/3gpp",
        "video/3gpp2",
        "video/x-m4v",
        "video/webm",
        "video/x-mng",
        "video/ogg",
        "video/ogv",
        "video/dash",
        "video/x-ms-wmv",
        "video/x-ms-asf",
        "video/x-matroska",
      ],
      audio: [
        "audio/mpeg",
        "audio/ogg",
        "audio/wav",
        "audio/webm",
        "audio/aac",
        "audio/flac",
        "audio/mp4",
        "audio/mp3",
      ],
      design: [
        // Figma file types
        "application/figma",
        "application/vnd.figma",
        // Adobe file types
        "application/x-photoshop",
        "application/photoshop",
        "application/psd",
        "application/vnd.adobe.photoshop",
        "application/illustrator",
        "application/vnd.adobe.illustrator",
        "application/pdf+ai",
        "application/x-indesign",
        "application/vnd.adobe.indesign-idml-package",
        "application/x-adobe-xd",
        "application/vnd.adobe.xd",
        "application/x-adobe-premiere",
        "application/vnd.adobe.premiere-proj",
        "application/x-adobe-aftereffects",
        "application/vnd.adobe.aftereffects.proj",
        // Sketch file types
        "application/sketch",
        "application/x-sketch",
        "application/vnd.sketch",
        "application/vnd.sketch+xml",
        // Illustrator file types
        "application/x-illustrator",
        "application/vnd.adobe.illustrator",
        "application/vnd.adobe.illustrator+xml",
        // XD file types
        "application/x-adobe-xd",
        "application/vnd.adobe.xd",
        "application/vnd.adobe.xd+xml",
        // Premiere file types
        "application/x-adobe-premiere",
      ],
    };
    return category && map[category] ? map[category] : null;
  }
  