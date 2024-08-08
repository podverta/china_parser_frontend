export interface SportsData {
    [key: string]: any
    'akty.com'?: {
        火箭篮球联盟?: LeagueData[]
        火箭女子篮球联盟?: LeagueData[]
        IPBL篮球专业组?: LeagueData[]
        IPBL女子篮球专业组?: LeagueData[]
    }
    'fb.com'?: {
        火箭篮球联盟?: LeagueData[]
        火箭女子篮球联盟?: LeagueData[]
        IPBL篮球专业组?: LeagueData[]
        IPBL女子篮球专业组?: LeagueData[]
    }
}

export interface RateData {
    total_point: string;
    total_bet_0: string;
    total_bet_1: string;
    handicap_point_0: string;
    handicap_bet_0: string;
    handicap_point_1: string;
    handicap_bet_1: string;
    server_time: string;
    [key: string]: string;
}


export interface LeagueData {
    changed: boolean;
    opponent_0: string;
    opponent_1: string;
    score_game: string;
    time_game: string;
    rate: RateData;
    server_time: string;
}

export interface League {
    site: string
    content: LeagueData
}

interface OpponentData {
    name: string
    score: string
    handicap_bet: string
    total_bet: string
}

export interface LeagueStorage {
    [key: string]: {
      value: { [key: string]: League[] };
      maxLength: number;
    };
  }
