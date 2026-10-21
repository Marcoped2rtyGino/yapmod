use std::cmp::Ordering;

/// Splits a version into its numeric parts, so they can be compared.
fn parse_version(version: &str) -> Vec<u64> {
    version
        .trim()
        .trim_start_matches('v')
        .split(['.', '-', '+'])
        .map(|part| part.parse::<u64>().unwrap_or(0))
        .collect()
}

/// Compares two versions.
pub fn compare_versions(left: &str, right: &str) -> Ordering {
    let left = parse_version(left);
    let right = parse_version(right);

    for index in 0..left.len().max(right.len()) {
        let difference = left
            .get(index)
            .copied()
            .unwrap_or(0)
            .cmp(&right.get(index).copied().unwrap_or(0));

        if difference != Ordering::Equal {
            return difference;
        }
    }

    Ordering::Equal
}

/// Returns true when `candidate` is a newer version than `current`.
pub fn is_newer(candidate: &str, current: &str) -> bool {
    compare_versions(candidate, current) == Ordering::Greater
}
