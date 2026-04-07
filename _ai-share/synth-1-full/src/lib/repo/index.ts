import { MockGeoRepo } from "./geoRepo";
import { MockAiStylistRepo } from "./aiStylistRepo";
import { MockSearchRepo } from "./searchRepo";
import { MockCmsRepo } from "./cmsRepo";
import { MockLooksRepo } from "./looksRepo";

export const repo = {
  geo: new MockGeoRepo(),
  aiStylist: new MockAiStylistRepo(),
  search: new MockSearchRepo(),
  cms: new MockCmsRepo(),
  looks: new MockLooksRepo(),
};
