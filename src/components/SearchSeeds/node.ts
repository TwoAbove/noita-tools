// These are wrappers for more generic tree traversal functions

export const getTreeTools = (idKey: string, nodeKey: string) => {
	const getById = (tree, id) => {
		if (id === 'search') {
			// Special case for search pane
			return {
				id: 'search',
				type: 'search'
			};
		}
		if (tree[idKey] === id) {
			return tree;
		}
		if (!tree[nodeKey]) {
			return false;
		}
		for (const n of tree[nodeKey]) {
			if (n[idKey] === id) {
				return n;
			}
			const found = getById(n, id);
			if (found) {
				return found;
			}
		}
		return false;
	};

	const getParentNode = (tree, id) => {
		if (tree[idKey] === id) {
			return false; // no parent;
		}
		if (!tree[nodeKey]) {
			return false;
		}
		for (const n of tree[nodeKey]) {
			if (n[idKey] === id) {
				return tree;
			}
			const found = getParentNode(n, id);
			if (found) {
				return found;
			}
		}
	};

	const addToId = (tree, id, data) => {
		const node = getById(tree, id);
		if (!node) {
			return;
		}
		node[nodeKey].push(data);
	};

	const deleteById = (tree, id) => {
		const node = getParentNode(tree, id);
		if (!node) {
			return;
		}
		if (!node[nodeKey]) {
			return;
		}
		node[nodeKey].map(n => deleteById(n, n[idKey]));
		const index = node[nodeKey].map(x => x[idKey]).indexOf(id);
		node[nodeKey].splice(index, 1);
	};

	const move = (tree, source, dest) => {
		const sourceNode = getById(tree, source);
		const destNode = getById(tree, dest);
		deleteById(tree, sourceNode[idKey]);
		addToId(tree, destNode[idKey], sourceNode);
	};

	return {
		getById,
		addToId,
		getParentNode,
		deleteById,
		move
	};
};
