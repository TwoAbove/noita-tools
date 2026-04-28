const prng = @import("nolla_prng");
const mat = @import("materials");

const max_shifts = 20;
const max_from_materials = 6;

const FromEntry = struct {
    probability: f64,
    materials: [max_from_materials]u16,
    len: usize,
};

const ToEntry = struct {
    probability: f64,
    material: u16,
};

const Shift = struct {
    flask_to: bool,
    flask_from: bool,
    from: [max_from_materials]u16,
    from_len: usize,
    to: u16,
    gold_to_x: u16,
    grass_to_x: u16,
};

const materials_from = [_]FromEntry{
    .{ .probability = 1.0, .materials = .{ mat.water, mat.water_static, mat.water_salt, mat.water_ice, 0, 0 }, .len = 4 },
    .{ .probability = 1.0, .materials = .{ mat.lava, 0, 0, 0, 0, 0 }, .len = 1 },
    .{ .probability = 1.0, .materials = .{ mat.radioactive_liquid, mat.poison, mat.material_darkness, 0, 0, 0 }, .len = 3 },
    .{ .probability = 1.0, .materials = .{ mat.oil, mat.swamp, mat.peat, 0, 0, 0 }, .len = 3 },
    .{ .probability = 1.0, .materials = .{ mat.blood, 0, 0, 0, 0, 0 }, .len = 1 },
    .{ .probability = 1.0, .materials = .{ mat.blood_fungi, mat.fungi, mat.fungisoil, 0, 0, 0 }, .len = 3 },
    .{ .probability = 1.0, .materials = .{ mat.blood_cold, mat.blood_worm, 0, 0, 0, 0 }, .len = 2 },
    .{ .probability = 1.0, .materials = .{ mat.acid, 0, 0, 0, 0, 0 }, .len = 1 },
    .{ .probability = 0.4, .materials = .{ mat.acid_gas, mat.acid_gas_static, mat.poison_gas, mat.fungal_gas, mat.radioactive_gas, mat.radioactive_gas_static }, .len = 6 },
    .{ .probability = 0.4, .materials = .{ mat.magic_liquid_polymorph, mat.magic_liquid_unstable_polymorph, 0, 0, 0, 0 }, .len = 2 },
    .{ .probability = 0.4, .materials = .{ mat.magic_liquid_berserk, mat.magic_liquid_charm, mat.magic_liquid_invisibility, 0, 0, 0 }, .len = 3 },
    .{ .probability = 0.6, .materials = .{ mat.diamond, 0, 0, 0, 0, 0 }, .len = 1 },
    .{ .probability = 0.6, .materials = .{ mat.silver, mat.brass, mat.copper, 0, 0, 0 }, .len = 3 },
    .{ .probability = 0.2, .materials = .{ mat.steam, mat.smoke, 0, 0, 0, 0 }, .len = 2 },
    .{ .probability = 0.4, .materials = .{ mat.sand, 0, 0, 0, 0, 0 }, .len = 1 },
    .{ .probability = 0.4, .materials = .{ mat.snow_sticky, 0, 0, 0, 0, 0 }, .len = 1 },
    .{ .probability = 0.05, .materials = .{ mat.rock_static, 0, 0, 0, 0, 0 }, .len = 1 },
    .{ .probability = 0.0003, .materials = .{ mat.gold, mat.gold_box2d, 0, 0, 0, 0 }, .len = 2 },
};

const materials_to = [_]ToEntry{
    .{ .probability = 1.0, .material = mat.water },
    .{ .probability = 1.0, .material = mat.lava },
    .{ .probability = 1.0, .material = mat.radioactive_liquid },
    .{ .probability = 1.0, .material = mat.oil },
    .{ .probability = 1.0, .material = mat.blood },
    .{ .probability = 1.0, .material = mat.blood_fungi },
    .{ .probability = 1.0, .material = mat.acid },
    .{ .probability = 1.0, .material = mat.water_swamp },
    .{ .probability = 1.0, .material = mat.alcohol },
    .{ .probability = 1.0, .material = mat.sima },
    .{ .probability = 1.0, .material = mat.blood_worm },
    .{ .probability = 1.0, .material = mat.poison },
    .{ .probability = 1.0, .material = mat.vomit },
    .{ .probability = 1.0, .material = mat.pea_soup },
    .{ .probability = 1.0, .material = mat.fungi },
    .{ .probability = 0.8, .material = mat.sand },
    .{ .probability = 0.8, .material = mat.diamond },
    .{ .probability = 0.8, .material = mat.silver },
    .{ .probability = 0.8, .material = mat.steam },
    .{ .probability = 0.5, .material = mat.rock_static },
    .{ .probability = 0.5, .material = mat.gunpowder },
    .{ .probability = 0.5, .material = mat.material_darkness },
    .{ .probability = 0.5, .material = mat.material_confusion },
    .{ .probability = 0.2, .material = mat.rock_static_radioactive },
    .{ .probability = 0.02, .material = mat.magic_liquid_polymorph },
    .{ .probability = 0.02, .material = mat.magic_liquid_random_polymorph },
    .{ .probability = 0.15, .material = mat.magic_liquid_teleportation },
    .{ .probability = 0.10, .material = mat.mimic_liquid },
    .{ .probability = 0.01, .material = mat.urine },
    .{ .probability = 0.01, .material = mat.poo },
    .{ .probability = 0.01, .material = mat.void_liquid },
    .{ .probability = 0.01, .material = mat.cheese_static },
};

const greedy_materials = [_]u16{
    mat.brass,
    mat.silver,
    mat.radioactive_liquid,
    mat.pea_soup,
    mat.acid_gas,
    mat.poo,
    mat.mammi,
    mat.rotten_meat_radioactive,
    mat.vomit,
};

var shifts = [_]Shift{.{ .flask_to = false, .flask_from = false, .from = .{0} ** max_from_materials, .from_len = 0, .to = 0, .gold_to_x = mat.gold, .grass_to_x = mat.grass_holy }} ** max_shifts;
var shift_count: usize = 0;

fn pickFrom(world_seed: u32, rnd: *prng.RandomPos) FromEntry {
    var weight_sum: f64 = 0.0;
    for (materials_from) |item| {
        weight_sum += item.probability;
    }
    const val = prng.randomNextF(world_seed, rnd, 0.0, weight_sum);

    var min: f64 = 0.0;
    for (materials_from) |item| {
        const max = min + item.probability;
        if (val >= min and val <= max) {
            return item;
        }
        min = max;
    }
    return materials_from[0];
}

fn pickTo(world_seed: u32, rnd: *prng.RandomPos) ToEntry {
    var weight_sum: f64 = 0.0;
    for (materials_to) |item| {
        weight_sum += item.probability;
    }
    const val = prng.randomNextF(world_seed, rnd, 0.0, weight_sum);

    var min: f64 = 0.0;
    for (materials_to) |item| {
        const max = min + item.probability;
        if (val >= min and val <= max) {
            return item;
        }
        min = max;
    }
    return materials_to[0];
}

export fn PickFungal(world_seed: u32, requested_max_shifts: i32) u32 {
    shift_count = 0;
    const limit: usize = if (requested_max_shifts == -1 or requested_max_shifts > max_shifts)
        max_shifts
    else
        @intCast(requested_max_shifts);

    var randoms = prng.NollaPrng{ .seed = 0 };

    for (0..limit) |iter| {
        var convert_tries: i32 = 0;
        var converted_any = false;

        while (!converted_any and convert_tries < 20) {
            const seed2: i32 = 42345 + @as(i32, @intCast(iter)) + 1000 * convert_tries;
            var rnd = prng.RandomPos{ .x = 9123, .y = seed2 };
            randoms.setRandomSeed(world_seed, 89346, @floatFromInt(seed2));

            const from = pickFrom(world_seed, &rnd);
            const to = pickTo(world_seed, &rnd);

            var shift = Shift{
                .flask_to = false,
                .flask_from = false,
                .from = .{0} ** max_from_materials,
                .from_len = 0,
                .to = to.material,
                .gold_to_x = mat.gold,
                .grass_to_x = mat.grass_holy,
            };

            if (prng.randomNextI(world_seed, &rnd, 1, 100) <= 75) {
                if (prng.randomNextI(world_seed, &rnd, 1, 100) <= 50) {
                    shift.flask_from = true;
                } else {
                    shift.flask_to = true;
                    if (prng.randomNextI(world_seed, &rnd, 1, 1000) != 1) {
                        const index = randoms.random(0, greedy_materials.len - 1);
                        shift.gold_to_x = greedy_materials[@intCast(index)];
                        shift.grass_to_x = mat.grass;
                    }
                }
            }

            for (from.materials[0..from.len]) |material| {
                if (shift.from_len == 0 or material != shift.to) {
                    shift.from[shift.from_len] = material;
                    shift.from_len += 1;
                    converted_any = true;
                }
            }

            shifts[shift_count] = shift;
            shift_count += 1;
            convert_tries += 1;
        }
    }

    return @intCast(shift_count);
}

export fn GetFungalFlaskTo(index: u32) u32 {
    return if (index < shift_count and shifts[index].flask_to) 1 else 0;
}

export fn GetFungalFlaskFrom(index: u32) u32 {
    return if (index < shift_count and shifts[index].flask_from) 1 else 0;
}

export fn GetFungalFromCount(index: u32) u32 {
    return if (index < shift_count) @intCast(shifts[index].from_len) else 0;
}

export fn GetFungalFromMaterial(index: u32, material_index: u32) u32 {
    if (index >= shift_count or material_index >= shifts[index].from_len) {
        return 0;
    }
    return shifts[index].from[material_index];
}

export fn GetFungalTo(index: u32) u32 {
    return if (index < shift_count) shifts[index].to else 0;
}

export fn GetFungalGoldToX(index: u32) u32 {
    return if (index < shift_count) shifts[index].gold_to_x else mat.gold;
}

export fn GetFungalGrassToX(index: u32) u32 {
    return if (index < shift_count) shifts[index].grass_to_x else mat.grass_holy;
}
