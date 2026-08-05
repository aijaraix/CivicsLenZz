with open("src/lib/civic-database.ts", "r") as f:
    text = f.read()

new_type = """
export type ActivityItem = {
  slug: string;
  title: string;
  official: string;
  summary: string;
  signatures: number;
  goal: number;
  age: string;
  color: string;
  category: string;
};
"""

text = text.replace("export const activityItems: ActivityItem[] = [", new_type + "export const activityItems: ActivityItem[] = [")
with open("src/lib/civic-database.ts", "w") as f:
    f.write(text)
