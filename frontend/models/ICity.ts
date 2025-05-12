export interface ICity {
  id: number;
  name: string;
}

export const cities: ICity[] = [
  { id: 1, name: "Алматы" },
  { id: 2, name: "Астана" },
  { id: 3, name: "Шымкент" },
  { id: 4, name: "Актобе" },
  { id: 5, name: "Атырау" },
  { id: 6, name: "Актау" },
  { id: 7, name: "Караганда" },
  { id: 8, name: "Павлодар" },
  { id: 9, name: "Петропавловск" },
  { id: 10, name: "Костанай" },
  { id: 11, name: "Уральск" },
  { id: 12, name: "Усть-Каменогорск" },
  { id: 13, name: "Кокшетау" },
  { id: 14, name: "Кызылорда" },
  { id: 15, name: "Тараз" },
  { id: 16, name: "Туркестан" },
];

export const getCityById = (id: number): ICity | undefined => {
  return cities.find((city) => city.id === id);
};

export const getCityNameById = (id: number): string => {
  const city = getCityById(id);
  return city ? city.name : "";
};
