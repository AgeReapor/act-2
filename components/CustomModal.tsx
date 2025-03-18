import { Button, Modal, Pressable, Text, View } from 'react-native';

export type ModalButtonProps = {
    text: string;
    textColor: string;
    color: string;
    onPress: () => void;
};

type CustomModalProps = {
    isActive?: boolean;
    title?: string;
    message?: string;
    buttons?: ModalButtonProps[];
};
export const CustomModal = ({
    isActive = false,
    title = 'Title',
    message = 'Modal Message',
    buttons = [
        {
            text: 'Button',
            textColor: 'text-white',
            color: 'color-slate-200',
            onPress: () => console.log('Pressed Modal Button'),
        },
    ],
}: CustomModalProps) => {
    if (!isActive) return null;

    return (
        <Modal
            animationType="slide"
            visible={isActive}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            <View
                className="flex-1 items-center justify-center bg-slate-900"
                style={{
                    width: '100%',
                    height: '100%',
                }}>
                <View className="w-8/12 items-center justify-center gap-4 rounded-md bg-slate-800 p-4 py-10 text-white">
                    <Text className="text-2xl font-bold leading-tight text-white">{title}</Text>
                    <Text className="mt-4 pb-4 text-white">{message}</Text>
                    <View className="gap-2">
                        {buttons.map((button, index) => (
                            <ModalButton
                                key={'modalbtn_' + index}
                                text={button.text}
                                textColor={button.textColor}
                                color={button.color}
                                onPress={button.onPress}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const ModalButton = ({ text, textColor, color, onPress }: ModalButtonProps) => {
    return (
        <Button
            // className={`flex-1 rounded-lg p-2 ${color} ${textColor}`}

            title={text}
            onPress={onPress}></Button>
    );
};
