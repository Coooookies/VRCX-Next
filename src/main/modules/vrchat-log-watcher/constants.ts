export const GAMELOG_PARSER_DATE_REGEXP = /^\[(?<topic>[a-zA-Z0-9 ]+)\] (?<content>.*)$/
export const GAMELOG_PARSER_REGEXP =
  /^(?<date>\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}) (?<type>[a-zA-Z]+) +- {2}(?<data>.*)$/

export const GAMELOG_IMAGE_OR_STRING_LOAD_REGEXP =
  /Attempting to load (image|String) from URL '(?<url>[^']+)'/

export const GAMELOG_PLAYER_ACTIVITY_REGEXP =
  /OnPlayer(Joined|Left) (?<username>[^(]+) (\((?<userId>[^)]+)\))?/

export const GAMELOG_PREPARATION_REGEXP =
  /Preparation has taken (?<seconds>\d+) seconds, progress is (?<progress>[\d.]+)%, loader state is (?<state>\w+)/
