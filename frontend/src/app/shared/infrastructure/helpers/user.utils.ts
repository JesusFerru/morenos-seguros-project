export function getEnumOptions<T extends object>(enumObj: T): { value: string; label: string }[] {
    return Object.entries(enumObj).map(([key, value]) => ({
        value: value as string,
        label: capitalizeFirstLetter(key),
    }));
}

function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
