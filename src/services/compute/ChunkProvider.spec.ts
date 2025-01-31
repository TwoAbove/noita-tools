import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";

import { ChunkProvider, ChunkStatus, IComputeHandlerConfig, Status } from "./ChunkProvider";

vi.mock("lodash", async () => {
  return { uniqueId: vi.fn() };
});

import { uniqueId as mockUniqueId } from "lodash";

const uniqueId = vi.mocked(mockUniqueId);

describe("ChunkProvider", () => {
  let config: IComputeHandlerConfig;
  let chunkProvider: ChunkProvider;

  beforeEach(() => {
    vi.useFakeTimers();
    config = {
      searchFrom: 0,
      searchTo: 100000,
      chunkSize: 10,
      etaHistoryTimeConstant: 120,
      chunkProcessingTimeTarget: 5,
    };
    chunkProvider = new ChunkProvider(config);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it("should construct with the provided config", () => {
    expect(chunkProvider.config).toEqual(config);
  });

  describe("commitChunk", () => {
    let chunk: ChunkStatus;

    beforeEach(() => {
      chunk = {
        chunkId: "chunk_1",
        from: 0,
        to: 10,
        status: "waiting",
        appetite: 1,
      };
      chunkProvider.unCommittedChunks = [chunk];
      chunk.crashId = setTimeout(() => {}, 1000);
    });

    it("should remove the given chunk from unCommittedChunks", () => {
      chunkProvider.commitChunk(chunk.chunkId, []);
      expect(chunkProvider.unCommittedChunks).toEqual([]);
    });

    it("should clear the crashId timeout", () => {
      const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
      chunkProvider.commitChunk(chunk.chunkId, []);
      expect(clearTimeoutSpy).toHaveBeenCalledWith(chunk.crashId);
    });

    it("should update progress and report progress to eta", () => {
      chunkProvider.commitChunk(chunk.chunkId, []);
      expect(chunkProvider.progress).toBe(10);
    });

    it("should set the chunk status to done", () => {
      chunkProvider.commitChunk(chunk.chunkId, []);
      expect(chunk.status).toBe("done");
    });
  });

  describe("registerChunk", () => {
    let chunk: ChunkStatus;

    beforeEach(() => {
      chunk = {
        chunkId: "chunk_1",
        from: 0,
        to: 10,
        status: "waiting",
        appetite: 1,
      };
    });

    it("should set a crashId timeout for the chunk", () => {
      const setTimeoutSpy = vi.spyOn(global, "setTimeout").mockImplementation(() => 123 as unknown as NodeJS.Timeout);
      chunkProvider.registerChunk(chunk);
      expect(setTimeoutSpy).toHaveBeenCalled();
      expect(chunk.crashId).toBe(123);
    });

    it("should add the chunk to unCommittedChunks", () => {
      chunkProvider.registerChunk(chunk);
      expect(chunkProvider.unCommittedChunks).toEqual([chunk]);
    });
  });

  describe("getNextChunk", () => {
    beforeEach(() => {
      uniqueId.mockReturnValue("chunk_1");
    });

    it("should return a new chunk if no orphan chunks are available", () => {
      const newChunk = chunkProvider.getNextChunk(1);
      expect(newChunk).toEqual({
        chunkId: "chunk_1",
        from: 0,
        to: 10,
        status: "pending",
        appetite: 1,
        crashId: expect.any(Object),
      });
    });

    it("should return an orphan chunk if available", () => {
      const orphanChunk: ChunkStatus = {
        chunkId: "chunk_1",
        from: 0,
        to: 100,
        status: "waiting",
        appetite: 1,
      };
      chunkProvider.orphanChunks = [orphanChunk];
      const newChunk = chunkProvider.getNextChunk(1);
      expect(newChunk).toBe(orphanChunk);
    });

    it("should register a new chunk if no orphan chunks are available", () => {
      let chunk = chunkProvider.getNextChunk(1);
      expect(chunk).toEqual({
        chunkId: "chunk_1",
        from: 0,
        to: 10,
        status: "pending",
        appetite: 1,
        crashId: expect.any(Object),
      });
      chunk = chunkProvider.getNextChunk(1);
      expect(chunk).toEqual({
        chunkId: "chunk_1",
        from: 10,
        to: 20,
        status: "pending",
        appetite: 1,
        crashId: expect.any(Object),
      });
      chunk = chunkProvider.getNextChunk(1);
      expect(chunk).toEqual({
        chunkId: "chunk_1",
        from: 20,
        to: 30,
        status: "pending",
        appetite: 1,
        crashId: expect.any(Object),
      });
    });

    it("should register an orphan chunk if available", () => {
      const orphanChunk: ChunkStatus = {
        chunkId: "chunk_1",
        from: 0,
        to: 100,
        status: "waiting",
        appetite: 1,
      };
      chunkProvider.orphanChunks = [orphanChunk];
      const registerChunkSpy = vi.spyOn(chunkProvider, "registerChunk");
      chunkProvider.getNextChunk(1);
      expect(registerChunkSpy).toHaveBeenCalledWith(orphanChunk);
    });

    describe("appetite", () => {
      it("should get next chunk with base chunk size", () => {
        const chunk = chunkProvider.getNextChunk(1);
        expect(chunk).not.toBeNull();
        expect(chunk!.from).toBe(0);
        expect(chunk!.to).toBe(config.chunkSize);
        expect(chunk!.status).toBe("pending");
      });

      it("should get next chunk with modified chunk size based on appetite and confidence", () => {
        const chunkProvider = new ChunkProvider({
          searchFrom: 0,
          searchTo: 100000,
          chunkSize: 10,
          etaHistoryTimeConstant: 120,
          chunkProcessingTimeTarget: 5,
        });
        const processingRate = 50; // 50/s
        for (let i = 0; i <= 50; i++) {
          const chunk = chunkProvider.getNextChunk(1);
          vi.advanceTimersByTime(((chunk!.to - chunk!.from) / processingRate) * 1000);
          chunkProvider.commitChunk(chunk!.chunkId, []);
        }
        vi.advanceTimersByTime(config.etaHistoryTimeConstant * 2);

        const idealChunkSize = processingRate * chunkProvider.config.chunkProcessingTimeTarget;
        const chunk = chunkProvider.getNextChunk(1);
        expect(chunk).not.toBeNull();
        expect(chunk!.to - chunk!.from).toBe(idealChunkSize);
        expect(chunk!.status).toBe("pending");
      });

      it("should get next chunk with modified chunk size based on appetite and confidence", () => {
        const chunkProvider = new ChunkProvider({
          searchFrom: 0,
          searchTo: 100000,
          chunkSize: 10,
          etaHistoryTimeConstant: 120,
          chunkProcessingTimeTarget: 5,
        });
        const processingRate = 100; // 50/s
        for (let i = 0; i <= 50; i++) {
          const chunk = chunkProvider.getNextChunk(1);
          vi.advanceTimersByTime(((chunk!.to - chunk!.from) / processingRate) * 1000);
          chunkProvider.commitChunk(chunk!.chunkId, []);
        }
        vi.advanceTimersByTime(config.etaHistoryTimeConstant * 2);

        const idealChunkSize = processingRate * chunkProvider.config.chunkProcessingTimeTarget;
        const chunk = chunkProvider.getNextChunk(1);
        expect(chunk).not.toBeNull();
        expect(chunk!.to - chunk!.from).toBe(idealChunkSize);
        expect(chunk!.status).toBe("pending");
      });

      it("should get next chunk with min chunk size", () => {
        const chunkProvider = new ChunkProvider({
          searchFrom: 0,
          searchTo: 100000,
          chunkSize: 10,
          etaHistoryTimeConstant: 120,
          chunkProcessingTimeTarget: 5,
        });
        const processingRate = 1; // 1/s
        for (let i = 0; i <= 50; i++) {
          const chunk = chunkProvider.getNextChunk(1);
          vi.advanceTimersByTime(((chunk!.to - chunk!.from) / processingRate) * 1000);
          chunkProvider.commitChunk(chunk!.chunkId, []);
        }
        vi.advanceTimersByTime(config.etaHistoryTimeConstant * 2);

        const idealChunkSize = processingRate * chunkProvider.config.chunkProcessingTimeTarget;
        const chunk = chunkProvider.getNextChunk(1);
        expect(chunk).not.toBeNull();
        expect(chunk!.to - chunk!.from).toBe(10);
        expect(chunk!.status).toBe("pending");
      });
    });
  });

  describe("registerChunk timeout behavior", () => {
    let chunk: ChunkStatus;

    beforeEach(() => {
      chunk = {
        chunkId: "chunk_1",
        from: 0,
        to: 10,
        status: "pending",
        appetite: 1,
      };
      chunkProvider.registerChunk(chunk);
    });

    it("should move the chunk to the orphanChunks array after the timeout", () => {
      expect(chunkProvider.unCommittedChunks).toEqual([chunk]);
      expect(chunkProvider.orphanChunks).toEqual([]);

      vi.advanceTimersByTime(1000 * 60 * 6);

      expect(chunkProvider.unCommittedChunks).toEqual([]);
      expect(chunkProvider.orphanChunks).toEqual([chunk]);
    });

    it("should set the chunk status to waiting after the timeout", () => {
      expect(chunk.status).toBe("pending");

      vi.advanceTimersByTime(1000 * 60 * 6);

      expect(chunk.status).toBe("waiting");
    });
  });
});
