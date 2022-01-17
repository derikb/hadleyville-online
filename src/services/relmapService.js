import store from '../store/store.js';
import EventEmitter from '../models/EventEmitter.js';
import { updateNode, deleteNode, clearNodes, importNodes } from '../store/relmap-reducer.js';
import RelMapNode from '../models/relMapNode.js';

const emitter = new EventEmitter();

const getAllNodes = function () {
    const nodes = store.getState().relmap;
    return nodes.map((obj) => {
        return new RelMapNode(obj);
    });
};

const getById = function (uuid) {
    const nodes = store.getState().relmap;
    const data = nodes.find((node) => {
        return node.uuid === uuid;
    });
    if (data) {
        return new RelMapNode(data);
    }
    return null;
};

const save = function (node) {
    store.dispatch(updateNode({
        node: node.toJSON()
    }));
};

const remove = function (uuid) {
    store.dispatch(deleteNode({ uuid }));
    emitter.trigger('relmap:delete', {
        id: uuid
    });
};

const sort = function (sortUuids) {
    // No sort for map nodes
};

const deleteAll = function () {
    store.dispatch(clearNodes());
};

const importAll = function (nodes) {
    store.dispatch(importNodes({ nodes }));
};

export {
    emitter,
    getAllNodes,
    getById,
    save,
    sort,
    remove,
    deleteAll,
    importAll
};
