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

export interface LeagueData {
    opponent_0: OpponentData
    opponent_1: OpponentData
    process_time: string
    server_time: string
}

export interface League {
    site: string
    content: LeagueData[]
}

interface OpponentData {
    name: string
    score: string
    handicap_bet: string
    total_bet: string
}

export interface LeagueStorage {
    [key: string]: {
        value: League[];
        maxLength: number;
    };
}
