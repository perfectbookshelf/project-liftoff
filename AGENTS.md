# Architecture rules
- Photo references use an isolated, grounded render of the existing furniture geometry; keep the interactive preview and checkout screenshots unchanged.
- Photoreal generation stays in a server function and uses the image provider's editing contract; credentials never enter browser bundles.
- Associate each photo request with a configuration revision and ignore obsolete results; wood changes never initiate paid generation without a click.
- Strip preview-only DOM inspection attributes from 3D view modules because Three Fiber interprets them as invalid object properties.