import { onRequest as __api_events_ts_onRequest } from "C:\\Users\\lucas\\Downloads\\dj-ozzy-entertainment\\functions\\api\\events.ts"
import { onRequest as __api_upload_image_ts_onRequest } from "C:\\Users\\lucas\\Downloads\\dj-ozzy-entertainment\\functions\\api\\upload-image.ts"
import { onRequestPost as __contact_ts_onRequestPost } from "C:\\Users\\lucas\\Downloads\\dj-ozzy-entertainment\\functions\\contact.ts"

export const routes = [
    {
      routePath: "/api/events",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_events_ts_onRequest],
    },
  {
      routePath: "/api/upload-image",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_upload_image_ts_onRequest],
    },
  {
      routePath: "/contact",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__contact_ts_onRequestPost],
    },
  ]