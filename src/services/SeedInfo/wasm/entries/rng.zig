const prng = @import("nolla_prng");

var world_seed: u32 = 0;
var rng = prng.NollaPrng{ .seed = 0 };

export fn SetWorldSeed(seed: u32) void {
    world_seed = seed;
}

export fn GetWorldSeed() u32 {
    return world_seed;
}

export fn SetRandomSeed(x: f64, y: f64) void {
    rng.setRandomSeed(world_seed, x, y);
}

export fn Random() f32 {
    return @floatCast(rng.next());
}

export fn RandomInt(min: i32, max: i32) i32 {
    return rng.random(min, max);
}

export fn RandomRounded(min: f64, max: f64) i32 {
    return rng.random(prng.roundHalfToEvenI32(min), prng.roundHalfToEvenI32(max));
}

export fn RandomMax(max: f64) i32 {
    return rng.random(0, prng.roundHalfToEvenI32(max));
}

export fn Randomf() f32 {
    return Random();
}

export fn SeededRandom(seed: u32, x: f64, y: f64) f64 {
    var local_rng = prng.NollaPrng{ .seed = 0 };
    local_rng.setRandomSeed(seed, x, y);
    return local_rng.next();
}

export fn ProceduralRandomf(x: f64, y: f64, min: f64, max: f64) f32 {
    rng.setRandomSeed(world_seed, x, y);
    const result = min + ((max - min) * rng.next());
    return @floatCast(result);
}

export fn ProceduralRandomi(x: f64, y: f64, min: f64, max: f64) i32 {
    rng.setRandomSeed(world_seed, x, y);
    return rng.random(prng.roundHalfToEvenI32(min), prng.roundHalfToEvenI32(max));
}

export fn RandomDistribution(min: i32, max: i32, mean: i32, sharpness: i32) i32 {
    if (sharpness == 0) {
        return rng.random(min, max);
    }

    const adjusted_mean = @as(f32, @floatFromInt(mean - min)) / @as(f32, @floatFromInt(max - min));
    const distribution = prng.getDistribution(&rng, adjusted_mean, sharpness);
    const delta: i32 = @intFromFloat(@round(@as(f32, @floatFromInt(max - min)) * distribution));
    return min + delta;
}

export fn RandomDistributionf(min: f32, max: f32, mean: f32, sharpness: i32) f32 {
    if (sharpness == 0) {
        const value: f32 = @floatCast(rng.next());
        return (value * (max - min)) + min;
    }

    const adjusted_mean = (mean - min) / (max - min);
    return min + (max - min) * prng.getDistribution(&rng, adjusted_mean, sharpness);
}

export fn RoundHalfOfEven(value: f64) f32 {
    return prng.roundHalfToEvenF32(@floatCast(value));
}
