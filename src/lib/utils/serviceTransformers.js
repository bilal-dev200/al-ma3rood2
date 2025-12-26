/**
 * Transform service category tree into a flat list with hierarchy information
 * @param {Array} tree - Category tree from API
 * @returns {Array} Flat list of categories with depth, isParent, parentLabel, etc.
 */
function collectCategoryOptions(nodes = [], trail = [], depth = 0) {
  if (!Array.isArray(nodes)) return [];
  return nodes.flatMap((node) => {
    const id = node?.id;
    const label = node?.name;
    const path = [...trail, label].filter(Boolean);
    const children = node?.children_recursive || [];
    const current = id ? [{
      id: String(id),
      label,
      fullPath: path.join(" › "),
      depth,
      isParent: false,
      parentLabel: trail[trail.length - 1] || null
    }] : [];
    if (!children.length) {
      return current;
    }
    return current.concat(collectCategoryOptions(children, path, depth + 1));
  });
}

export function transformServiceCategories(tree = []) {
  if (!Array.isArray(tree)) return [];

  // Only process root nodes (those with no parent_id) at the top level
  // This prevents children that are incorrectly present in the root array
  // from being added twice (once as root, once as child).
  const rootNodes = tree.filter(node => !node.parent_id);

  return rootNodes.flatMap((node) => {
    const id = node?.id;
    const label = node?.name;
    const children = node?.children_recursive || [];
    const options = [];

    // Add parent category
    if (id) {
      options.push({
        id: String(id),
        label,
        fullPath: label,
        depth: 0,
        isParent: children.length > 0,
        parentLabel: null
      });
    }

    // Add children with depth information
    if (children.length > 0) {
      options.push(...collectCategoryOptions(children, [label], 1));
    }

    return options;
  });
}

export function transformRegionsResponse(locationsResponse) {
  const countries =
    locationsResponse?.countries ??
    locationsResponse?.data?.countries ??
    [];
  const saudi =
    countries.find((country) =>
      country?.name?.toLowerCase().includes("saudi")
    ) || countries[0];
  const regions = saudi?.regions ?? [];
  return regions.map((region) => ({
    id: String(region.id),
    label: region.name,
    governorates: (region.governorates || []).map((gov) => ({
      id: String(gov.id),
      label: gov.name,
    })),
  }));
}

