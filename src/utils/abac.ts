import {
  ActionAttributes,
  EnvironmentAttributes,
  PolicyRule,
  ResourceAttributes,
  UserAttributes,
} from '@/types/auth';

export class ABACPolicy {
  private rules: PolicyRule[] = [];

  addRule(rule: PolicyRule) {
    this.rules.push(rule);
  }

  evaluate(
    user: UserAttributes,
    resource: ResourceAttributes,
    action: ActionAttributes,
    environment: EnvironmentAttributes
  ): boolean {
    for (const rule of this.rules) {
      if (rule.condition(user, resource, action, environment)) {
        return rule.effect === 'allow';
      }
    }
    return false; // Default deny
  }
}
