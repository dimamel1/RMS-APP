import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import SectionHeader from '../components/SectionHeader';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSubscriptionPlans, selectUserProfile, toggleNewsletter } from '../store/slices/userSlice';
import { selectAdvertisements, selectNewsletter } from '../store/slices/uiSlice';
import { getFontFamilyFromPostScript } from '../theme/fonts';

const MenuScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserProfile);
  const plans = useAppSelector(selectSubscriptionPlans);
  const ads = useAppSelector(selectAdvertisements);
  const newsletter = useAppSelector(selectNewsletter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <SectionHeader title="Mon compte" />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{user.name}</Text>
          <Text style={styles.cardSubtitle}>{user.profession}</Text>
          <Text style={styles.cardMeta}>{user.organization}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Abonnements" />
        {plans.map((plan) => (
          <View key={plan.id} style={[styles.card, plan.id === user.subscriptionType && styles.activeCard]}>
            <Text style={styles.cardTitle}>{plan.name}</Text>
            <Text style={styles.cardPrice}>
              {plan.price === 0 ? 'Gratuit' : `${plan.price} ${plan.currency} / ${plan.billingCycle}`}
            </Text>
            <View style={styles.benefits}>
              {plan.benefits.map((benefit) => (
                <Text key={benefit} style={styles.benefitItem}>
                  • {benefit}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Newsletter" />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{newsletter.title}</Text>
          <Text style={styles.cardSubtitle}>{newsletter.description}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => dispatch(toggleNewsletter())}>
            <Text style={styles.primaryButtonLabel}>
              {user.preferences.receiveNewsletter ? 'Se désinscrire' : newsletter.ctaLabel}
            </Text>
          </TouchableOpacity>
          <Text style={styles.cardMeta}>{newsletter.privacyNotice}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Promotions" />
        {ads.map((ad) => (
          <TouchableOpacity key={ad.id} style={styles.card} onPress={() => Linking.openURL(ad.ctaUrl)}>
            <Text style={styles.cardTitle}>{ad.title}</Text>
            <Text style={styles.cardSubtitle}>{ad.ctaLabel}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 80,
  },
  section: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 0,
    padding: 20,
    gap: 12,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: getFontFamilyFromPostScript('FreightTextProBold-Regular'), // FreightText Pro Bold from Figma
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#475569',
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  cardMeta: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: getFontFamilyFromPostScript('Inter-Regular'), // Inter 400 from Figma
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    fontFamily: getFontFamilyFromPostScript('FreightSansProSemibold-Regular'), // FreightSans Pro Semibold from Figma
  },
  benefits: {
    gap: 6,
  },
  benefitItem: {
    fontSize: 13,
    color: '#475569',
    fontFamily: getFontFamilyFromPostScript('FreightSansProBook-Regular'), // FreightSans Pro Book from Figma
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 0,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getFontFamilyFromPostScript('Neusa-SemiBold'), // Neusa SemiBold from Figma (for buttons)
  },
});

export default MenuScreen;

