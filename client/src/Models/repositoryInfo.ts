export default class RepositoryInfo{
    description?: string;
    name?: string;
    pushedAt?: string;

    constructor(o?: any)
    {
        if (!o)
        {
            return;
        }
//
        this.name = o.name;
        this.pushedAt = new Date(o.pushed_at).toLocaleString("ru", 
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    }
}