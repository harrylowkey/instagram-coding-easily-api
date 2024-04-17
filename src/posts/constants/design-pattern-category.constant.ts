import { DesignPatternCategoryEnum } from '~posts/enums/design-pattern-category.enum';

export const DESIGN_PATTERN_CATEGORIES = {
    [DesignPatternCategoryEnum.CREATIONAL]: ['singleton', 'builder', 'factory method', 'abstract factory', 'prototype'],
    [DesignPatternCategoryEnum.BEHAVIORAL]: [
        'chain of responsibility',
        'command',
        'iterator',
        'mediator',
        'memento',
        'observer',
        'state',
        'strategy',
        'template method',
        'visitor'
    ],
    [DesignPatternCategoryEnum.STRUCTURAL]: ['adapter', 'decorator', 'facade', 'proxy', 'composite', 'flyweight']
};
