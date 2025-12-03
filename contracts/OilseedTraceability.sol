// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OilseedTraceability {
    struct Batch {
        string batchId;
        string crop;
        string originFarm;
        uint256 createdAt;
        bool exists;
    }

    struct TraceEvent {
        string actorType;
        string actorId;
        string location;
        string action;
        uint256 timestamp;
        string extraData;
    }

    mapping(string => Batch) public batches;
    mapping(string => TraceEvent[]) private batchEvents;

    event BatchRegistered(string batchId, string crop, string originFarm, uint256 createdAt);
    event EventAdded(string batchId, string actorType, string actorId, string action, uint256 timestamp);

    function registerBatch(
        string memory _batchId,
        string memory _crop,
        string memory _originFarm
    ) public {
        require(!batches[_batchId].exists, "Batch already exists");

        batches[_batchId] = Batch({
            batchId: _batchId,
            crop: _crop,
            originFarm: _originFarm,
            createdAt: block.timestamp,
            exists: true
        });

        emit BatchRegistered(_batchId, _crop, _originFarm, block.timestamp);
    }

    function addEvent(
        string memory _batchId,
        string memory _actorType,
        string memory _actorId,
        string memory _location,
        string memory _action,
        string memory _extraData
    ) public {
        require(batches[_batchId].exists, "Batch not registered");

        TraceEvent memory e = TraceEvent({
            actorType: _actorType,
            actorId: _actorId,
            location: _location,
            action: _action,
            timestamp: block.timestamp,
            extraData: _extraData
        });

        batchEvents[_batchId].push(e);

        emit EventAdded(_batchId, _actorType, _actorId, _action, block.timestamp);
    }

    function getEvents(string memory _batchId)
        public
        view
        returns (TraceEvent[] memory)
    {
        require(batches[_batchId].exists, "Batch not registered");
        return batchEvents[_batchId];
    }

    function getBatch(string memory _batchId)
        public
        view
        returns (string memory, string memory, string memory, uint256)
    {
        require(batches[_batchId].exists, "Batch not registered");
        Batch memory b = batches[_batchId];
        return (b.batchId, b.crop, b.originFarm, b.createdAt);
    }
}
