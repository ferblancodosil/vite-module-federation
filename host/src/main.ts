import { initFederation } from "@softarc/native-federation";

(async () => {
  await initFederation({
    remote: import.meta.env.VITE_REMOTE_HOST,
  });

  await import("./bootstrap");
})();
