const prng = @import("nolla_prng");
const mat = @import("materials");

const liquids = [_]u16{
    mat.acid,
    mat.alcohol,
    mat.blood,
    mat.blood_fungi,
    mat.blood_worm,
    mat.cement,
    mat.lava,
    mat.magic_liquid_berserk,
    mat.magic_liquid_charm,
    mat.magic_liquid_faster_levitation,
    mat.magic_liquid_faster_levitation_and_movement,
    mat.magic_liquid_invisibility,
    mat.magic_liquid_mana_regeneration,
    mat.magic_liquid_movement_faster,
    mat.magic_liquid_protection_all,
    mat.magic_liquid_teleportation,
    mat.magic_liquid_unstable_polymorph,
    mat.magic_liquid_unstable_teleportation,
    mat.magic_liquid_worm_attractor,
    mat.material_confusion,
    mat.mud,
    mat.oil,
    mat.poison,
    mat.radioactive_liquid,
    mat.swamp,
    mat.urine,
    mat.water,
    mat.water_ice,
    mat.water_swamp,
    mat.magic_liquid_random_polymorph,
};

const alchemy = [_]u16{
    mat.bone,
    mat.brass,
    mat.coal,
    mat.copper,
    mat.diamond,
    mat.fungi,
    mat.gold,
    mat.grass,
    mat.gunpowder,
    mat.gunpowder_explosive,
    mat.rotten_meat,
    mat.sand,
    mat.silver,
    mat.slime,
    mat.snow,
    mat.soil,
    mat.wax,
    mat.honey,
};

var result = [_]u16{0} ** 6;

fn contains(items: []const u16, len: usize, item: u16) bool {
    for (items[0..len]) |existing| {
        if (existing == item) {
            return true;
        }
    }
    return false;
}

fn pickMaterials(rng: *prng.NollaPrng, materials: *[4]u16, material_count: *usize, source: []const u16, count: usize) void {
    var counter: usize = 0;
    var failed: usize = 0;
    while (counter < count and failed < 99999) {
        const index: usize = @intFromFloat(rng.next() * @as(f64, @floatFromInt(source.len)));
        const picked = source[index];
        if (!contains(materials, material_count.*, picked)) {
            materials[material_count.*] = picked;
            material_count.* += 1;
            counter += 1;
        } else {
            failed += 1;
        }
    }
}

fn pickForOutput(rng: *prng.NollaPrng, world_seed: u32, output: []u16) void {
    var materials = [_]u16{0} ** 4;
    var material_count: usize = 0;
    pickMaterials(rng, &materials, &material_count, &liquids, 3);
    pickMaterials(rng, &materials, &material_count, &alchemy, 1);

    var shuffle_rng = prng.NollaPrng.init(@as(f64, @floatFromInt(world_seed >> 1)) + 12534.0);
    var i: i32 = @intCast(material_count - 1);
    while (i >= 0) : (i -= 1) {
        const limit = @as(f64, @floatFromInt(i + 1));
        const index: usize = @intFromFloat(shuffle_rng.next() * limit);
        const current: usize = @intCast(i);
        const tmp = materials[current];
        materials[current] = materials[index];
        materials[index] = tmp;
    }

    _ = rng.next();
    _ = rng.next();

    output[0] = materials[0];
    output[1] = materials[1];
    output[2] = materials[2];
}

export fn PickAlchemy(world_seed: u32) void {
    var rng = prng.NollaPrng.init((@as(f64, @floatFromInt(world_seed)) * 0.17127000) + 1323.59030000);
    for (0..5) |_| {
        _ = rng.next();
    }

    pickForOutput(&rng, world_seed, result[0..3]);
    pickForOutput(&rng, world_seed, result[3..6]);
}

export fn GetAlchemyMaterial(index: u32) u32 {
    if (index >= result.len) {
        return 0;
    }
    return result[index];
}
