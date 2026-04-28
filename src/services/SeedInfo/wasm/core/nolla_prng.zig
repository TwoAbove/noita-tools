const std = @import("std");

const u32_max_half = 0x80000000;
const lcg_modulus = 0x7fffffff;
const lcg_multiplier = 0x41a7;
const lcg_divisor = 0x1f31d;

pub const RandomPos = struct {
    x: i32,
    y: i32,
};

fn asU32(value: bool) u32 {
    return if (value) 1 else 0;
}

fn truncDoubleToU32(value: f64) u32 {
    const truncated: i64 = @intFromFloat(value);
    return @truncate(@as(u64, @bitCast(truncated)));
}

fn setRandomSeedHelper(value: f64) u32 {
    const bits: u64 = @bitCast(value);
    const finite = ((bits >> 0x20) & 0x7fffffff) < 0x7ff00000;
    const in_range = -9.223372036854776e18 <= value and value < 9.223372036854776e18;
    if (!finite or !in_range) {
        return 0;
    }

    return truncDoubleToU32(value);
}

fn setRandomSeedHelper2(a: u32, b: u32, ws: u32) u32 {
    var v2 = ((a -% b) -% ws) ^ (ws >> 0xd);
    var v1 = ((b -% v2) -% ws) ^ (v2 << 8);
    var v3 = ((ws -% v2) -% v1) ^ (v1 >> 0xd);
    v2 = ((v2 -% v1) -% v3) ^ (v3 >> 0xc);
    v1 = ((v1 -% v2) -% v3) ^ (v2 << 0x10);
    v3 = ((v3 -% v2) -% v1) ^ (v1 >> 5);
    v2 = ((v2 -% v1) -% v3) ^ (v3 >> 3);
    v1 = ((v1 -% v2) -% v3) ^ (v2 << 10);
    return ((v3 -% v2) -% v1) ^ (v1 >> 0xf);
}

pub fn roundHalfToEvenF32(value: f32) f32 {
    const floor_value = @floor(value);
    const diff = value - floor_value;

    if (diff < 0.5) {
        return floor_value;
    }

    if (diff > 0.5) {
        return floor_value + 1.0;
    }

    const floor_int: i64 = @intFromFloat(floor_value);
    if (@mod(floor_int, 2) == 0) {
        return floor_value;
    }

    return floor_value + 1.0;
}

pub fn roundHalfToEvenI32(value: f64) i32 {
    return @intFromFloat(roundHalfToEvenF32(@floatCast(value)));
}

pub const NollaPrng = struct {
    seed: f64,

    pub fn init(seed: f64) NollaPrng {
        var self = NollaPrng{ .seed = seed };
        _ = self.next();
        return self;
    }

    pub fn next(self: *NollaPrng) f64 {
        const seed_int: i32 = @intFromFloat(self.seed);
        var next_value = (lcg_multiplier *% seed_int) -% (lcg_modulus *% @divTrunc(seed_int, lcg_divisor));
        if (next_value <= 0) {
            next_value += lcg_modulus;
        }

        self.seed = @floatFromInt(next_value);
        return self.seed / lcg_modulus;
    }

    pub fn nextU(self: *NollaPrng) u32 {
        _ = self.next();
        return @intFromFloat(self.seed * 4.656612875e-10 * 2147483645.0);
    }

    pub fn setRandomFromWorldSeed(self: *NollaPrng, seed: u32) void {
        self.seed = @floatFromInt(seed);
        if (2147483647.0 <= self.seed) {
            self.seed = @as(f64, @floatFromInt(seed)) * 0.5;
        }
    }

    pub fn setRandomSeed(self: *NollaPrng, ws: u32, x: f64, y: f64) void {
        const a = ws ^ 0x93262e6f;
        const b = a & 0xfff;
        const c = (a >> 0xc) & 0xfff;

        const x_adjusted = x + @as(f64, @floatFromInt(b));
        var y_adjusted = y + @as(f64, @floatFromInt(c));

        var seed_material = x_adjusted * 134217727.0;
        const e = setRandomSeedHelper(seed_material);

        if (@abs(y_adjusted) >= 102400.0 or @abs(x_adjusted) <= 1.0) {
            seed_material = y_adjusted * 134217727.0;
        } else {
            var y_work = y_adjusted * 3483.328;
            y_work += @floatFromInt(e);
            y_adjusted *= y_work;
            seed_material = y_adjusted;
        }

        const f = setRandomSeedHelper(seed_material);
        const g = setRandomSeedHelper2(e, f, ws);

        const diddle_table = [_]u32{ 0, 4, 6, 25, 12, 39, 52, 9, 21, 64, 78, 92, 104, 118, 18, 32, 44 };
        const magic_number = 252645135;

        var t = g;
        t = t +% asU32(g < u32_max_half) +% asU32(g == 0);
        t -%= g / magic_number;
        t +%= asU32((g % magic_number < diddle_table[g / magic_number]) and (g < 0xc3c3c3c3 + 4 or g >= 0xc3c3c3c3 + 62));
        t = (t +% asU32(g > u32_max_half)) >> 1;
        t +%= asU32(g == 0xffffffff);

        self.seed = @floatFromInt(t);
        _ = self.next();

        var h = ws & 3;
        while (h != 0) : (h -= 1) {
            _ = self.next();
        }
    }

    pub fn random(self: *NollaPrng, min: i32, max: i32) i32 {
        const range: f64 = @floatFromInt(max + 1 - min);
        return min + @as(i32, @intFromFloat(range * self.next()));
    }
};

pub fn randomNextF(world_seed: u32, random_pos: *RandomPos, min: f64, max: f64) f64 {
    var rng = NollaPrng{ .seed = 0 };
    rng.setRandomSeed(world_seed, @floatFromInt(random_pos.x), @floatFromInt(random_pos.y));
    const result = min + ((max - min) * rng.next());
    random_pos.y += 1;
    return result;
}

pub fn randomNextI(world_seed: u32, random_pos: *RandomPos, min: i32, max: i32) i32 {
    var rng = NollaPrng{ .seed = 0 };
    rng.setRandomSeed(world_seed, @floatFromInt(random_pos.x), @floatFromInt(random_pos.y));
    const result = rng.random(min, max);
    random_pos.y += 1;
    return result;
}

pub fn getDistribution(rng: *NollaPrng, mean: f32, sharpness: i32) f32 {
    const pi: f32 = 3.1415;
    const mean_offset: f32 = 0.5 - mean;

    var i: i32 = 0;
    while (i < 100) : (i += 1) {
        const r1: f32 = @floatCast(rng.next());
        const r2: f32 = @floatCast(rng.next());
        const div = @abs(r1 - mean);

        if (r2 < ((1.0 - div) * 0.005)) {
            return r1;
        }

        if (div < 0.5) {
            const wave: f32 = @floatCast(@sin(@as(f64, @floatCast((mean_offset + r1) * pi))));
            const shaped: f32 = @floatCast(std.math.pow(f64, wave, @floatFromInt(sharpness)));
            if (shaped > r2) {
                return r1;
            }
        }
    }

    return @floatCast(rng.next());
}
