"use client";

import { useEffect, useState } from "react";

/* Does this person actually have a signature stored?

   It has to be asked, not assumed. Two things went wrong without it:

   - A CSS mask whose image 404s is not treated as an empty mask. The element
     keeps its background and paints as a solid block, so a signer with nothing
     on file got a black rectangle stamped over their name on a lab report.
   - The capture dialog decided "no signature on file" from a flag on the cached
     user object that nothing ever sets, so it claimed the slot was empty
     immediately after a successful upload.

   Loading the image is the check. It is the same request the mask makes, so the
   browser serves the mask from cache rather than fetching twice, and a 404 or
   an auth failure both land in onerror.

   Returns "unknown" until the answer is in, so callers can hold off rather than
   flashing an empty slot on every render. */
export function useSignatureOnFile(signerId, version = 0) {
    /* The answer is stored against the request it belongs to. Deriving the
       result from that -- rather than resetting state whenever the id changes --
       keeps the effect free of synchronous setState and its extra render pass. */
    const [answer, setAnswer] = useState(null);

    const key = signerId ? `${signerId}:${version}` : null;

    useEffect(() => {
        if (!key) return undefined;

        let cancelled = false;
        const image = new Image();

        image.onload = () => {
            if (!cancelled) setAnswer({ key, present: true });
        };
        image.onerror = () => {
            if (!cancelled) setAnswer({ key, present: false });
        };

        image.src = `/api/users/${signerId}/signature?v=${version}`;

        return () => {
            cancelled = true;
        };
    }, [key, signerId, version]);

    if (!key) return "absent";
    if (!answer || answer.key !== key) return "unknown";

    return answer.present ? "present" : "absent";
}
