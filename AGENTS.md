# Architecture rules
- Photo references use an isolated, grounded render of the existing furniture geometry; keep the interactive preview and checkout screenshots unchanged.
- Photoreal generation stays in a server function and uses the image provider's editing contract; credentials never enter browser bundles.
- Associate each photo request with a configuration revision and ignore obsolete results; wood changes never initiate paid generation without a click.
- Use splitFinish as the shared source of material-role assignments for 3D views and photo requests so finish placement stays consistent.
- Strip preview-only DOM inspection attributes from 3D view modules because Three Fiber interprets them as invalid object properties.
- Restore configurator browser storage only after hydration and delay persistence until restoration finishes, so returning designs cannot mismatch server markup or be overwritten by defaults.
- Keep external environment lighting in its own Suspense and error boundary so slow or blocked HDR downloads cannot hide furniture or crash the wizard.