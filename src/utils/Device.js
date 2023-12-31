import deferred from "./deferred";
import { getGPUTier } from "detect-gpu";

export const Device = {
    isReady: deferred()
};

(async () => {
    const gpu = await getGPUTier();
    Device.gpu = gpu;

    Device.isReady.resolve();
})();